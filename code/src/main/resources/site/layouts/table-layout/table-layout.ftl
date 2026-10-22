<div class="table-layout ${paddingClass!''}">
  <div class="table-layout__wrapper">
    <button class="table-layout__button">
      <img src="[@assetUrl path='/images/arrow-short-transparent.svg' /]" alt="" />
      <div>
        [#if heading?has_content && headingStyle?has_content]
          <${headingStyle} class="table-layout__button__heading">${heading}</${headingStyle}>
        [/#if]
        [#if subtitle?has_content]
          <div class="table-layout__button__subtitle">${subtitle}</div>
        [/#if]
      </div>
    </button>
    <div class="table-layout__panel[#if mode == 'edit'] table-layout__panel--edit[/#if]">
      <div data-portal-region="main">
        [#if mainRegion?has_content]
          [#list mainRegion.components as pageComponent]
            [@component path=pageComponent.path /]
          [/#list]
        [/#if]
      </div>
    </div>
  </div>
</div>
